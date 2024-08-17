export const getObject =  (key: string) => {
  const data = localStorage.getItem(key);
  console.log(key, data)
  return data ? JSON.parse(data) : null;
};
export const setObject = async (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};
