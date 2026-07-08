import { type SelectQueryBuilder } from 'typeorm';

import { type PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';

export const addPersonPhoneFiltersToQueryBuilder = ({
  queryBuilder,
  phoneNumbers,
}: {
  queryBuilder: SelectQueryBuilder<PersonWorkspaceEntity>;
  phoneNumbers: string[];
}): SelectQueryBuilder<PersonWorkspaceEntity> => {
  queryBuilder = queryBuilder
    .select([
      'person.id',
      'person.phonesPrimaryPhoneNumber',
      'person.phonesPrimaryPhoneCallingCode',
      'person.phonesAdditionalPhones',
      'person.deletedAt',
    ])
    .where('person.phonesPrimaryPhoneNumber IN (:...phoneNumbers)', {
      phoneNumbers,
    })
    .withDeleted();

  for (const [index, phoneNumber] of phoneNumbers.entries()) {
    const phoneNumberParamName = `phoneNumber${index}`;

    queryBuilder = queryBuilder.orWhere(
      `person.phonesAdditionalPhones @> :${phoneNumberParamName}::jsonb`,
      {
        [phoneNumberParamName]: JSON.stringify([{ number: phoneNumber }]),
      },
    );
  }

  return queryBuilder;
};
