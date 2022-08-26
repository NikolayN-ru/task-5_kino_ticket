import React, { useEffect, useState } from 'react';
import './App.css';
import Day from './components/Day';

interface Istate { }

const fultime: any[] = []
const hours = [10, 12, 14, 15, 16, 17, 18, 19, 20];
const now = new Date();
const day = now.getDate()
const days = [day]
function* generateSequence(i: number, end: number) {
  for (i; i <= end; i++) {
    const currentDay = (i: any) => {
      if (i > 31) {
        return i - 31
      }
      return i;
    }
    days.unshift(days[0] - 1)
    days.push(currentDay(days[days.length - 1] + 1))
  }
  yield 1
  for (let item in days) {
    fultime.push({ days: days[item], hour: hours, broned: [], myBroned: [], block: days[item] >= day ? false : true });
    for (let key in hours) {
      let rand = Math.random()
      if (rand > 0.9) {
        fultime[fultime.length - 1].broned.push(hours[key])
      }
    }
  }
}

let generator = generateSequence(1, 7);
generator.next();
generator.next();
const initialState: any[] = fultime;

function App() {
  const [state, setState] = useState<Array<any>>(initialState);
  const [action, setAction] = useState<any | null>(null);
  const [newArr, setNewArr] = useState<any>();
  const clickKino = (day: any, hour: any, id: any) => {
    setAction({ day: day, hour: hour, id });
  }

  const broned = () => {
    const newState = [...state]
    newState[action.id].myBroned.push(action.hour);
    newState[action.id].broned.push(action.hour);
    setState(newState)
    setAction(null)
    const s = `${action.id}-${action.hour}`;
    myStorage.setItem("myBan", s);
  }
  const myStorage = window.localStorage;

  useEffect(() => {
    const arrLikeCats = myStorage.getItem("myBan");
    let newArr: string[] = [];
    if (arrLikeCats) {
      newArr = arrLikeCats.split(" ");
      if (newArr) {
        let a = newArr[0].split("-");
        for (let q = 0; q < state.length; q++) {
          state[q].myBroned = [];
          if (q === Number(a[0])) {
            state[q].myBroned.push(Number(a[1]));
          }
        }
      }
    }
    setNewArr(newArr);
  }, [state]);

  return (
    <div className="App">
      <h1>KINO</h1>
      <div className="day">
        {state.map((item, id) => {
          return (
            <div key={id}>
              <h2 className={(item.days === day) ? 'active' : 'not'}>{item.days}</h2>
              <div className="time">
                {item.hour.length && item.hour.map((hour: number) => {
                  return (
                    <button
                      onClick={() => clickKino(item.days, hour, id)}
                      key={hour}
                      className={(item.days < day) ? "time-lost" : "time-container"}
                      disabled={(item.days < day && item.days > 7 || (item.broned.includes(hour))) ? true : false}
                    >
                      {item.myBroned.includes(hour) ? <span className="my">MY</span> :
                        !item.broned.includes(hour) ? hour : <span>BAN</span>
                      }
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
      {action &&
        <div className="Action">
          поддтвердите дату - {action.day} - число - {action.hour} часов 00 минут
          <button onClick={() => broned()}>DA</button>
          <button onClick={() => setAction(null)}>NET</button>
        </div>
      }
    </div>
  );
}

export default App;
