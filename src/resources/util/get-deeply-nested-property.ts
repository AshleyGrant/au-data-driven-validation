export function getDeeplyNestedProperty(obj, property) {
  if (property) {
    const props = property.split('.');
    props.map(p => {
      if (obj[p] === undefined) {
        obj[p] = {};
      }
      obj = obj[p]
    });
  }

  return obj;
}
