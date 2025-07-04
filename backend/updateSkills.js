const mongoose = require("mongoose");
const Skill = require("./models/Skill"); // Adjust the path if needed

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://kahodaraj123:raj16192003@cluster0.8v2fh.mongodb.net/crud",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

async function updateSkills() {
  try {

    const result = await Skill.updateMany(
      {},
      {
        $unset: {
          Completion_time: "",
          teamWork: ""
        },
        $set: {
          basePrice: 0,
          currency: "INR",
          duration: {
            value: 60,
            unit: "minutes"
          }
        }
      }
    );

    console.log(`Updated ${result.modifiedCount} documents`);
    await mongoose.disconnect();
  } catch (error) {
    console.error("Error updating skills:", error);
    await mongoose.disconnect();
  }
}

updateSkills();
