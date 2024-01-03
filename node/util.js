const axios = require("axios");

async function getFactFromGoService(age) {
  // Make an API call to the Go service to get the age fact
  const url = `http://localhost:8080/getFact?age=${age}`;
  const response = await axios.get(url);
  return response.data;
}

function getAgeMessage(age) {
  if (age < 10) {
    return "Wow, you're so young! Are you enjoying school?";
  } else if (age >= 10 && age < 18) {
    return "Looks like you are a teenager. Enjoying the teenage adventures?";
  } else if (age >= 18 && age < 30) {
    return "So, you're an adult. The adventure of adulthood begins!";
  } else if (age >= 30 && age < 50) {
    return "You might be married and enjoying the ride of parenthood and career!";
  } else {
    return "Wow, you've lived a full life! What's your secret to a happy life?";
  }
}

module.exports = {
  getAgeMessage,
  getFactFromGoService,
};
