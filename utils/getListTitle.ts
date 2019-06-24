import formatDate from './formatDate';
import formatPrettyDate from './formatPrettyDate'

export default  (filter) => {
  if (filter.value) {
    const today = formatDate(new Date());
    const date = formatDate(filter.value);
    if (today === date) {
      return "Today";
    }
    return formatPrettyDate(filter.value);
  } else {
    return filter.type;
  }
};