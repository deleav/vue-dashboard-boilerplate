// won't change only when newValue is undefined
import { List } from 'immutable'
const isList = List.isList
export default function merger (oldValue, newValue) {
  if (oldValue && oldValue.mergeWith && !isList(oldValue) && !isList(newValue)) {
    return oldValue.mergeWith(merger, newValue)
  }
  return typeof newValue !== 'undefined'
    ? newValue
    : newValue || oldValue
}
