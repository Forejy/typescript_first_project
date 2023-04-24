import express from 'express'
import calculateBMI from './api/calculateBMI'

const app = express()

app.get('/ping', (_req, res) => {
  res.send('pong')
})

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!')
})

app.get('/bmi', (req, res) => {
  try {
    throw new Error('Error during conversion')
    const height = Number(req.query.height)
    const weight = Number(req.query.weight)
    if (!isNaN(height) && !isNaN(weight)) res.send(calculateBMI(height, weight))
    else { throw new Error('Error during conversion') }
  } catch(error) {
    res.status(402).send(`Something happened : ${error}`)
  }
})

const PORT = 3003

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})




interface dailyExerciseHours {
  days: number,
  trainingDays: number,
  target: number,
  averageTime: number,
  success: boolean,
  rating: number,
  ratingExplained: string,
}

interface calculateExercisesValues {
  hours: number[],
  target: number
}

function parseArguments(args: string[]): calculateExercisesValues {
  if (args.length < 4) throw new Error("Not enough arguments")

  const target = Number(args[2])
  if (isNaN(target)) throw new Error("Target has to be a number")

  const hours = args.slice(3).map(n => Number(n))
  if (hours.filter(h => isNaN(h)).length > 0) { throw new Error("Hours have to be only numbers")
  } else {
    return {
      hours,
      target
    }
  }
}

function calculateExercises (hours: number[], target: number): dailyExerciseHours {
  const averageTime = hours.reduce(
    (previousValue, currentValue) => previousValue + currentValue
  ) / hours.length
  const comments = [
    'largely over, now redo it',
    'perfect',
    'very good but maybe next time',
    'not too bad but could better',
    'the goal was too high are energy lacked'
  ]

  return {
    days: hours.length,
    trainingDays: hours.filter(h => h !== 0).length,
    target,
    averageTime,
    success: averageTime >= target,
    rating: 2,
    ratingExplained: comments[2]
  }
}

// try {
//   const args = parseArguments(process.argv)
//   const dailyExerciseHours = calculateExercises(args.hours, args.target)
//   console.log(dailyExerciseHours)
// } catch (error) {
//   let errorMessage = 'Something bad happened.'
//   if (error instanceof Error) {
//     errorMessage += ' Error: ' + error.message;
//   }
//   console.log(errorMessage);
// }

