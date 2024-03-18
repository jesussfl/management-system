import { FieldValues } from 'react-hook-form'

export function getDirtyValues<
  DirtyFields extends Record<string, unknown>,
  Values extends Record<keyof DirtyFields, unknown>,
>(dirtyFields: DirtyFields, values: Values): Partial<typeof values> {
  const dirtyValues = Object.keys(dirtyFields).reduce((prev, key) => {
    // Unsure when RFH sets this to `false`, but omit the field if so.
    if (!dirtyFields[key]) return prev

    return {
      ...prev,
      [key]:
        typeof dirtyFields[key] === 'object'
          ? getDirtyValues(
              dirtyFields[key] as DirtyFields,
              values[key] as Values
            )
          : values[key],
    }
  }, {})

  return dirtyValues
}
export function getDirtyFieldss(dirtyFields: any, formValues: any) {
  if (typeof dirtyFields !== 'object' || dirtyFields === null || !formValues) {
    return {}
  }

  return Object.keys(dirtyFields).reduce((accumulator, key) => {
    const isDirty = dirtyFields[key]
    const value = formValues[key]

    // If it's an array, apply the logic recursively to each item
    if (Array.isArray(isDirty)) {
      // eslint-disable-next-line no-underscore-dangle
      const _dirtyFields = isDirty.map((item, index) =>
        getDirtyFieldss(item, value[index])
      )
      if (_dirtyFields.length > 0) {
        // eslint-disable-next-line no-param-reassign

        //ts ignore

        //@ts-ignore
        accumulator[key] = _dirtyFields
      }
    }
    // If it's an object, apply the logic recursively
    else if (typeof isDirty === 'object' && isDirty !== null) {
      // eslint-disable-next-line no-param-reassign
      //@ts-ignore

      accumulator[key] = getDirtyFieldss(isDirty, value)
    }
    // If it's a dirty field, get the value from formValues
    else if (isDirty) {
      // eslint-disable-next-line no-param-reassign
      //@ts-ignore

      accumulator[key] = value
    }

    return accumulator
  }, {})
}
