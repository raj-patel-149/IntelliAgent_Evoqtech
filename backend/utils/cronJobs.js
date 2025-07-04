const cron = require("node-cron");
const Case = require("../models/Case"); // Adjust path as needed
const sendMail = require("../utils/sendMail"); // Ensure correct path
const User = require("../models/User");

const formatAMPM = (date) => {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert 24-hour format to 12-hour format
  hours = hours < 10 ? "0" + hours : hours; // Ensure two-digit hours
  minutes = minutes < 10 ? "0" + minutes : minutes; // Ensure two-digit minutes
  return `${hours}:${minutes} ${ampm}`;
};

// Function to send reminders for upcoming cases
const remindCases = async () => {
  try {
    const now = new Date();
    let currentTime = formatAMPM(now); // Get current time in "hh:mm AM/PM" format

    console.log("🔍 Checking for reminders at:", currentTime);

    // Find cases that match reminder_time exactly
    const casesToRemind = await Case.find({
      reminder_time: currentTime,
      service_status: "waitingToStart",
    });

    for (let caseData of casesToRemind) {
      const user = await User.findOne({ name: caseData.receiver });
      if (caseData.receiver !== "NA") {
        await sendMail(
          user.email,
          "⏰ HCMS Service Reminder: Your Appointment Starts Soon!",
          `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <!-- Header -->
            <div style="background: #d9534f; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">HCMS SERVICE REMINDER</h1>
              <p style="color: white; margin: 8px 0 0; font-size: 18px;">Starts in 30 Minutes</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 25px;">
              <h2 style="color: #d9534f; margin-top: 0;">Dear ${
                caseData.receiver
              },</h2>
              
              <p style="font-size: 16px; line-height: 1.6;">
                This is a friendly reminder that your service appointment <strong>"${
                  caseData.header
                }"</strong> is scheduled to begin shortly.
              </p>
              
              <div style="background: #fff8f8; border-left: 4px solid #d9534f; padding: 15px; margin: 20px 0; border-radius: 0 4px 4px 0;">
                <div style="display: flex; align-items: center; margin-bottom: 10px;">
                  <div style="background: #d9534f; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; margin-right: 10px;">🕒</div>
                  <div>
                    <p style="margin: 0; font-weight: bold; color: #d9534f;">TODAY AT ${
                      caseData.time
                    }</p>
                    <p style="margin: 3px 0 0; color: #666;">${
                      caseData.date
                    }</p>
                  </div>
                </div>
                
                <div style="margin-top: 15px;">
                  <p style="margin: 5px 0; font-weight: bold;">📍 ${
                    caseData.location
                  }</p>
                  <p style="margin: 5px 0;"><strong>Service Type:</strong> ${
                    caseData.service
                  }</p>
                  ${
                    caseData.description
                      ? `<p style="margin: 5px 0;"><strong>Details:</strong> ${caseData.description}</p>`
                      : ""
                  }
                </div>
              </div>
              
              <p style="font-size: 16px; line-height: 1.6; color: #d9534f; font-weight: bold;">
                ⚠️ Please ensure you're prepared and available at the scheduled time.
              </p>
              
              <div style="background: #f1f5f9; padding: 15px; border-radius: 4px; margin: 25px 0; text-align: center;">
                <p style="margin: 0; font-size: 15px;">
                  Need to reschedule or have questions?<br>
                  <a href="mailto:support@hcms.com" style="color: #2563eb;">Contact HCMS Support immediately</a>
                </p>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background: #f1f5f9; padding: 15px; text-align: center; font-size: 14px; color: #64748b; border-top: 1px solid #e0e0e0;">
              <p style="margin: 5px 0;">© ${new Date().getFullYear()} HCMS Platform</p>
              <p style="margin: 5px 0; font-size: 12px;">This is an automated reminder - please do not reply to this email</p>
            </div>
          </div>
          `
        );

        console.log(`📩 Reminder sent for case ID: ${caseData._id}`);
      }
    }
  } catch (error) {
    console.error("❌ Error in remindCases:", error);
  }
};

// Function to check and mark missed cases
const missedCases = async () => {
  try {
    const now = new Date();
    const currentTime = formatAMPM(now); // Get current time in "hh:mm AM/PM" format

    console.log("🔍 Checking for missed cases at:", currentTime);

    // Find cases where miss_time matches the current time
    const casesMissed = await Case.find({
      miss_time: currentTime,
      service_status: "waitingToStart",
    });

    console.log("❌ Cases Marked as Missed:", casesMissed.length);

    for (let caseData of casesMissed) {
      caseData.service_status = "missed";
      await caseData.save();

      const user = await User.findOne({ name: caseData.receiver });
      user.score -= 5;
      await user.save();

      if (caseData.receiver !== "NA") {
        await sendMail(
          user.email,
          "⚠️ Important: Missed Service Notification",
          `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #fff3cd;">
            <h2 style="color: #d9534f;">❌ Missed Service Alert</h2>
            <p style="font-size: 16px; color: #333;">
              Dear <strong>${caseData.receiver}</strong>,
            </p>
            <p style="font-size: 16px; color: #333;">
              We noticed that you missed your scheduled service <strong>"${caseData.header}"</strong> at <strong style="color: #d9534f;">${caseData.time}</strong> on <strong>${caseData.date}</strong>.
            </p>
            <p style="font-size: 16px; color: #333;">
              <strong>Service Details:</strong><br>
              🛠 <strong>Service:</strong> ${caseData.service}<br>
              📅 <strong>Date:</strong> ${caseData.date}<br>
              📍 <strong>Location:</strong> ${caseData.location}<br>
              📝 <strong>Description:</strong> ${caseData.description}
            </p>
            <hr style="border: 0; height: 1px; background-color: #ddd; margin: 20px 0;">
            <p style="font-size: 16px; color: #333;">
              If this was unintentional, please contact our support team immediately to discuss rescheduling.
            </p>
            <p style="font-size: 16px; color: #d9534f;">
              ⚠️ Take action now to avoid disruptions!
            </p>
            <p style="font-size: 16px; color: #333;">
              Best Regards, <br>
              <strong>Your Service Team</strong>
            </p>
          </div>
          `
        );
      }

      console.log(`❌ Missed case email sent for case ID: ${caseData._id}`);
    }
  } catch (error) {
    console.error("Error in missedCases:", error);
  }
};

// Schedule cron jobs to run **every minute**
cron.schedule("*/10 * * * *", async () => {
  console.log("🔄 Running scheduled jobs...");
  await remindCases();
  await missedCases();
});

module.exports = { remindCases, missedCases };
