import { type SelectQueryBuilder } from 'typeorm';

import { addPersonPhoneFiltersToQueryBuilder } from 'src/modules/match-participant/utils/add-person-phone-filters-to-query-builder';
import { type PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';

const buildMockQueryBuilder = () => {
  const calls: { method: string; args: unknown[] }[] = [];

  const mockQueryBuilder = {
    select: jest.fn().mockImplementation((...args: unknown[]) => {
      calls.push({ method: 'select', args });

      return mockQueryBuilder;
    }),
    where: jest.fn().mockImplementation((...args: unknown[]) => {
      calls.push({ method: 'where', args });

      return mockQueryBuilder;
    }),
    orWhere: jest.fn().mockImplementation((...args: unknown[]) => {
      calls.push({ method: 'orWhere', args });

      return mockQueryBuilder;
    }),
    withDeleted: jest.fn().mockImplementation(() => {
      calls.push({ method: 'withDeleted', args: [] });

      return mockQueryBuilder;
    }),
  };

  return {
    calls,
    queryBuilder:
      mockQueryBuilder as unknown as SelectQueryBuilder<PersonWorkspaceEntity>,
  };
};

describe('addPersonPhoneFiltersToQueryBuilder', () => {
  it('filters on the primary phone number column', () => {
    const { queryBuilder } = buildMockQueryBuilder();

    addPersonPhoneFiltersToQueryBuilder({
      queryBuilder,
      phoneNumbers: ['5551234567'],
    });

    expect(queryBuilder.where).toHaveBeenCalledWith(
      'person.phonesPrimaryPhoneNumber IN (:...phoneNumbers)',
      { phoneNumbers: ['5551234567'] },
    );
  });

  it('adds a jsonb containment filter per phone number for additional phones', () => {
    const { queryBuilder } = buildMockQueryBuilder();

    addPersonPhoneFiltersToQueryBuilder({
      queryBuilder,
      phoneNumbers: ['5551234567', '4155552671'],
    });

    expect(queryBuilder.orWhere).toHaveBeenCalledWith(
      'person.phonesAdditionalPhones @> :phoneNumber0::jsonb',
      { phoneNumber0: JSON.stringify([{ number: '5551234567' }]) },
    );
    expect(queryBuilder.orWhere).toHaveBeenCalledWith(
      'person.phonesAdditionalPhones @> :phoneNumber1::jsonb',
      { phoneNumber1: JSON.stringify([{ number: '4155552671' }]) },
    );
  });

  it('includes soft-deleted people so restore can reuse them', () => {
    const { queryBuilder } = buildMockQueryBuilder();

    addPersonPhoneFiltersToQueryBuilder({
      queryBuilder,
      phoneNumbers: ['5551234567'],
    });

    expect(queryBuilder.withDeleted).toHaveBeenCalled();
  });
});
