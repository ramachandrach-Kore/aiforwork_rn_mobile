export const sumChars = str => {
  let sum = 0;
  if (!str?.length) {
    return 1;
  }
  for (let i = 0; i < str?.length; i++) {
    sum += str.charCodeAt(i);
  }

  return sum;
};

export const generateBackgroundStyle = (name, color, colors) => {
  let background;
  if (color) {
    background = color.bgColor;
  } else {
    // Pick a deterministic color from the list
    const i = sumChars(name) % colors.length;
    background = colors[i].bgColor;
  }
  return {backgroundColor: background};
};

export const getColor = (name, colors) => {
  const i = sumChars(name) % colors.length;
  return colors[i];
};

export const colorCombo = ['#9F1AB1', '#6927DA', '#A15C07', '#027A48'];
export const backgroundCombo = ['#FBE8FF', '#ECE9FE', '#FEF7C3', '#D1FADF'];
