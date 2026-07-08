import { capitalize, isDefined } from 'twenty-shared/utils';

import { type ParsedName } from 'src/modules/contact-creation-manager/types/parsed-name.type';
import { getParsedNameFromDisplayName } from 'src/modules/contact-creation-manager/utils/get-parsed-name-from-display-name.util';
import { getParsedNameFromHandle } from 'src/modules/contact-creation-manager/utils/get-parsed-name-from-handle.util';
import { parsePhoneHandle } from 'src/utils/parse-phone-handle';

export const getFirstNameAndLastNameFromHandleAndDisplayName = (
  handle: string,
  displayName: string,
): ParsedName => {
  if (isDefined(parsePhoneHandle(handle))) {
    const fromPhoneDisplayName = isDefined(parsePhoneHandle(displayName))
      ? { firstName: '', lastName: '' }
      : getParsedNameFromDisplayName(displayName);

    return {
      firstName: capitalize(fromPhoneDisplayName.firstName),
      lastName: capitalize(fromPhoneDisplayName.lastName),
    };
  }

  const fromDisplayName = getParsedNameFromDisplayName(displayName);
  const fromHandle = getParsedNameFromHandle(handle);

  return {
    firstName: capitalize(fromDisplayName.firstName || fromHandle.firstName),
    lastName: capitalize(fromDisplayName.lastName || fromHandle.lastName),
  };
};
