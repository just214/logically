import colors from './colors'
const { darkGray, blueAlt} = colors;

/*
  Need to handle range dates for calendar events. 
  ( A dot on each date and possible show the number of days on the event)
  i.e. 6:00 PM (3 days)- 

*/

const vacation = {key:'vacation', color: 'red', selectedDotColor: 'blue'};
const massage = {key:'massage', color: 'blue', selectedDotColor: 'blue'};
const workout = {key:'workout', color: 'green'};

export default (tasksAndEvents, filter) => {
  let markedDates = {};
  tasksAndEvents
    .filter(task => task.isCompleted === false && task.dueDate !== "")
    .forEach(task => {

      const marker = {
        marked: true,
        dotColor: task.calendarColor || darkGray,
        selected: task.dueDate === filter.value,
        selectedColor: blueAlt
      };

      let markedDueDates = {}

      if (markedDueDates[task.dueDate]) {
        markedDueDates[task.dueDate].push(task)
      } else {
        markedDueDates[task.dueDate] = [task]
      }

      Object.keys(markedDueDates).forEach(key => {
        if (markedDueDates[key].length === 1) {
          const t = markedDueDates[key][0]
          markedDates[key] = {
            marked: true,
            dotColor: t.calendarColor || darkGray,
            selected: t.dueDate === filter.value,
            selectedColor: blueAlt
          }
        } else {
          
        }
      })
      
      // markedDates[task.dueDate] = {
      //   marked: true,
      //   dotColor: task.calendarColor ||"#333",
      //   selected: task.dueDate === filter.value,
      //   selectedColor: "#00adf5"
      // };
    });

    if (!markedDates[filter.value]) {
      markedDates[filter.value] = {
        selected: true,
        selectedColor: blueAlt
      }
    }

  return {...markedDates, 
    '2019-06-25': {dots: [vacation, massage, workout]}
  };
}



// <Calendar
//   markedDates={{
//     '2017-10-25': {dots: [vacation, massage, workout], selected: true, selectedColor: 'red'},
//     '2017-10-26': {dots: [massage, workout], disabled: true}
//   }}
//   markingType={'multi-dot'}
// />