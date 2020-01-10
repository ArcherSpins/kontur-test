const {
  axios
} = require("./fakeBackend/mock");

const {
  format
} = require('date-fns');


const getFeedbackByProductViewData = async (product, actualize = false) => {
  try {
    const response = await axios(`/feedback?product=${product}`);

    if (!response.data.feedback.length) return {
      message: "Отзывов пока нет"
    }

    const users = await axios(`/users?ids=${response.data.feedback.map(u => u.userId)}`);

    let {
      feedback
    } = response.data;

    if (actualize)
      feedback = feedback.sort((a, b) => a.date - b.date);

    feedback = feedback.map(r => ({
      ...r,
      user: users.data.users.find(u => u.id === r.userId).name + ` (${users.data.users.find(u => u.id === r.userId).email})`,
      // date: `${format(r.data, 'YYYY.')}`
    })).sort((a, b) => a.user - b.user);

    return {
      feedback
    }
  } catch (err) {
    return err.response.data
  }
};

module.exports = {
  getFeedbackByProductViewData
};
