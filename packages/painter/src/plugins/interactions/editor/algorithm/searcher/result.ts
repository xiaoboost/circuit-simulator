import type { IVariableObserverService } from '@circuit/contracts/painter';
import {
  PATH_DISTORTION_HOC_SCOPE as PathKey,
  PIN_STYLE_HOC_SCOPE as PinKey,
} from './constant';
import { type SearchResult } from './types';

export function setSearchResult(
  varService: IVariableObserverService,
  result: SearchResult[],
): void {
  for (const fixture of result) {
    if ('path' in fixture) {
      varService.set(PathKey, `${fixture.id}-path`, fixture.path);
      varService.set(PathKey, `${fixture.id}-pin`, fixture.path);
    }

    if ('pin' in fixture) {
      varService.set(PinKey, `${fixture.id}-${fixture.pin}`, fixture.style);
    }
  }
}
