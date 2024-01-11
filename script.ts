async function loadConversionRules(): Promise<Record<string, number>> {
  try {
    const response = await fetch('conversionRules.json');
    const data = await response.json();
    return data.units;
  } catch (error) {
    console.error('Failed to load conversion rules:', error);
    return {};
  }
}

let conversionRules: Record<string, number> = {};

async function initializeApp() {
  conversionRules = await loadConversionRules();

  // Добавляем динамически опции в селекторы
  const unitSelect = document.getElementById('unit') as HTMLSelectElement;
  const convertToSelect = document.getElementById('convertTo') as HTMLSelectElement;

  for (const unit in conversionRules) {
    const optionUnit = document.createElement('option');
    optionUnit.value = unit;
    optionUnit.text = `${unit} (${conversionRules[unit]})`;

    const optionConvertTo = document.createElement('option');
    optionConvertTo.value = unit;
    optionConvertTo.text = `${unit} (${conversionRules[unit]})`;

    unitSelect.add(optionUnit);
    convertToSelect.add(optionConvertTo);
  }
}

function convertDistance() {
  const distanceInput = document.getElementById('distance') as HTMLInputElement;
  const unitSelect = document.getElementById('unit') as HTMLSelectElement;
  const convertToSelect = document.getElementById('convertTo') as HTMLSelectElement;
  const resultDiv = document.getElementById('result');

  const distance = parseFloat(distanceInput.value);
  const unit = unitSelect.value;
  const convertTo = convertToSelect.value;

  if (isNaN(distance)) {
    resultDiv.innerHTML = '<div class="alert alert-danger">Please enter a valid distance.</div>';
    return;
  }

  const convertedDistance = distance * getConversionFactor(unit, convertTo);

  resultDiv.innerHTML = `<div class="alert alert-success">${distance} ${unit} is approximately ${convertedDistance.toFixed(2)} ${convertTo}.</div>`;
}

function getConversionFactor(fromUnit: string, toUnit: string): number {
  return conversionRules[toUnit] / conversionRules[fromUnit];
}

initializeApp();