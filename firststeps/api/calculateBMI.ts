interface calculateBMIValues {
  weight: number,
  height: number,
  bmi: string,
}

function calculateBMI(height: number, weight: number): calculateBMIValues {
  const categories = [
    "Underweight (Severe thinness)",
    "Underweight (Moderate thinness)",
    "Underweight (Mild thinness) ",
    "Normal range ",
    "Overweight (Pre-obese) ",
    "Obese (Class I) ",
    "Obese (Class II) ",
    "Obese (Class III) ",
  ]
  const bmiArray = [16, 17, 18.5, 25, 30, 35, 40]
  const heightM = height/100
  const bmi = weight / (heightM * heightM)

  for (let i = 0; i < bmiArray.length; i++) {
    if (bmi < bmiArray[i]) return {
      weight,
      height,
      bmi: categories[i]
    } 
  }
  return {
    weight,
    height,
    bmi: categories[7],
  }
}

export default calculateBMI