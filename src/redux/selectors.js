export const getState = (store) => store;

export const getList = (store) => (getState(store) ? getState(store).allIds : []);
export const getById = (store, id) => (getState(store) ? { ...getState(store).byIds[id], id } : {});
export const get = (store) => getList(store).map((id) => getById(store, id));
