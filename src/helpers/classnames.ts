export type IClassNamesObjectProps = { [key: string]: boolean };

export type IClassNamesProps = string | undefined

export const convertObjectToString = (classes: { [key: string]: boolean }): string => Object
  .keys(classes)
  .filter((key) => !!classes[key])
  .reduce(
    (classString: string, item: string) => (classString
      ? `${classString}${item ? ` ${item}` : ''}`
      : `${item}`),
    '',
  )

export const classnames = (
  ...classes: (IClassNamesObjectProps | IClassNamesProps)[]
): string => {
  if (classes[0] && typeof classes[0] === 'string') {
    return classes.join(' ')
  }
  return convertObjectToString(classes[0] as IClassNamesObjectProps)
}
