export function documentsHasErrored(bool) {
  return {
    type: 'DOCUMENTS_HAS_ERRORED',
    hasErrored: bool,
  };
}
export function documentsIsLoading(bool) {
  return {
    type: 'DOCUMENTS_IS_LOADING',
    isLoading: bool,
  };
}
export function documentsFetchDataSuccess(document) {
  return {
    type: 'DOCUMENTS_FETCH_DATA_SUCCESS',
    document,
  };
}
