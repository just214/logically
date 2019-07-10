import groupBy from 'lodash/groupBy'
import colors from './colors'
const { lightGray, blue} = colors;

export default (tasksAndEvents, filter) => {
  const inProgressOnly = tasksAndEvents.filter(
    task => task.isCompleted === false && !!task.dueDate
  );
  const tasksGroupedByStartDate = groupBy(inProgressOnly, task => task.dueDate);

  let markers = {};

  Object.keys(tasksGroupedByStartDate).forEach(key => {
    const taskGroup = tasksGroupedByStartDate[key];

    // Set the selected day if applicable
    const selected = filter.value === key;

    markers[key] = { dots: [], selected, selectedColor: blue };

    const dotsArray = markers[key].dots;
    taskGroup.forEach(task => {
        dotsArray.push({
          key: task.title,
          color: task.calendarColor || lightGray,
          selectedDotColor: task.calendarColor || lightGray
        });
    });
  });

  if (filter.value && !markers[filter.value]) {
    markers[filter.value] = {
      selected: true,
      selectedColor: blue
    }
  }

  return markers;
};