function calculateAge(birthday) {
  const birthDate = new Date(birthday);
  const currentDate = new Date();

  const ageInMilliseconds = currentDate - birthDate;
  const ageInYears = ageInMilliseconds / (365 * 24 * 60 * 60 * 1000);

  const years = Math.floor(ageInYears);
  const months = Math.floor((ageInYears - years) * 12);

  let ageString = '';
  if (years === 1) {
    ageString += '1 year';
  } else if (years > 1) {
    ageString += `${years} years`;
  }

  if (years > 0 && months > 0) {
    ageString += ' and ';
  }

  if (months === 1 || months === 0) {
    ageString += '1 month';
  } else if (months > 1) {
    ageString += `${months} months`;
  }

  return ageString;
}

export default calculateAge;
