interface O {[key: string]: any};

export const removeEmptyFields = (obj: O): O => {
  const cleanObject = {};
  const key = Object.keys(obj);
  key.forEach(k => {
    if (obj[k]) cleanObject[k] = obj[k];
  });
  return cleanObject;
};

export const parseEqual = (obj: O): string => {
  const entries = Object.entries(obj).map(e => parseString(e));
  const values = entries.map(e => e.join(' = '));
  const stringifiedValues = values.join(', ');
  return stringifiedValues;
};

export const parseString = (entry: any[]): any[] => {
  const [key, value] = entry;
  if (typeof entry[1] === 'string') return [key, `'${value}'`];
  return entry;
};
