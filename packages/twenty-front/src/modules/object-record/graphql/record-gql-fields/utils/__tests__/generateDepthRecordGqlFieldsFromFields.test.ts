import { FieldMetadataType, RelationType } from 'twenty-shared/types';

import { type FieldMetadataItem } from '@/object-metadata/types/FieldMetadataItem';
import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';
import { generateDepthRecordGqlFieldsFromFields } from '@/object-record/graphql/record-gql-fields/utils/generateDepthRecordGqlFieldsFromFields';

const buildObjectMetadataItem = (
  id: string,
  nameSingular: string,
  namePlural: string,
): EnrichedObjectMetadataItem =>
  ({
    id,
    nameSingular,
    namePlural,
    labelIdentifierFieldMetadataId: `${id}-label`,
    imageIdentifierFieldMetadataId: null,
    fields: [
      {
        id: `${id}-label`,
        name: 'name',
        type: FieldMetadataType.TEXT,
      },
    ],
  }) as unknown as EnrichedObjectMetadataItem;

const buildMorphRelationTarget = (
  id: string,
  nameSingular: string,
  namePlural: string,
) => ({
  type: RelationType.MANY_TO_ONE,
  sourceFieldMetadata: { id: 'source-field', name: 'target' },
  targetFieldMetadata: { id: 'target-field', name: 'source' },
  sourceObjectMetadata: {
    id: 'source-object',
    nameSingular: 'source',
    namePlural: 'sources',
  },
  targetObjectMetadata: { id, nameSingular, namePlural },
});

describe('generateDepthRecordGqlFieldsFromFields', () => {
  it('should skip a morph relation target whose object metadata was deleted instead of throwing', () => {
    const companyObjectMetadataItem = buildObjectMetadataItem(
      'company-id',
      'company',
      'companies',
    );

    const morphField: FieldMetadataItem = {
      id: 'morph-field-id',
      name: 'target',
      type: FieldMetadataType.MORPH_RELATION,
      settings: { relationType: RelationType.MANY_TO_ONE },
      morphRelations: [
        buildMorphRelationTarget('company-id', 'company', 'companies'),
        buildMorphRelationTarget('meeting-id', 'meeting', 'meetings'),
      ],
    } as unknown as FieldMetadataItem;

    const generate = () =>
      generateDepthRecordGqlFieldsFromFields({
        objectMetadataItems: [companyObjectMetadataItem],
        fields: [morphField],
        depth: 1,
      });

    expect(generate).not.toThrow();

    const result = generate();

    expect(result).toHaveProperty('targetCompany');
    expect(result).toHaveProperty('targetCompanyId');
    expect(Object.keys(result).some((key) => key.includes('Meeting'))).toBe(
      false,
    );
  });
});
