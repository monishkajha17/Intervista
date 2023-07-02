const app = require("express")();
const nodemailer = require('nodemailer');
const server = require("http").createServer(app);
const cors = require("cors");

const io = require("socket.io")(server, {
	cors: {
		origin: "*",
		methods: [ "GET", "POST" ]
	}
});

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
	res.send('Running');
});

io.on("connection", (socket) => {
	socket.emit("me", socket.id);

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	});

	socket.on("callUser", ({ userToCall, signalData, from, name }) => {
		io.to(userToCall).emit("callUser", { signal: signalData, from, name });
	});

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	});
});


// // Create a SMTP transporter with app password
// const transporter = nodemailer.createTransport({
// 	host: 'gmail',
// 	port: 465,
// 	secure: true,
// 	auth: {
// 	  user: 'ektesthere@gmail.com',
// 	  pass: '5066 8852',
// 	},
//   });
  
  
//   var transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true, // use SSL
//     auth: {
//         user: 'ektesthere@gmail.com',
//         pass: '5066 8852'
//     }
// });

//   // Compose the email
//   const mailOptions = {
// 	from: 'ektesthere@gmail.com',
// 	to: 'royekta2002@gmail.com',
// 	subject: 'Interview Feedback',
// 	text: `
// 	Dear [Candidate's Name],
  
// 	I hope this email finds you well. Thank you for taking the time to interview for the position at [Company Name]. We appreciate your interest in our company and your enthusiasm about the opportunity.
  
// 	We wanted to inform you that we are still in the process of evaluating all the candidates and making a final decision. We will be carefully reviewing the interview feedback and considering various factors before reaching a conclusion.
  
// 	We understand that waiting for the results can be challenging, but we assure you that we will contact you with our decision as soon as possible. We value your patience and understanding during this process.
  
// 	If you have any further questions or require any additional information, please feel free to reach out to us. We are more than happy to assist you.
  
// 	Thank you once again for your time and interest in [Company Name]. We will be in touch with you shortly with the interview results.
  
// 	Best regards,
// 	[Your Name]
// 	[Your Designation/Title]
// 	[Company Name]
// 	`
//   };



// // Send the email
// transporter.sendMail(mailOptions, (error, info) => {
//   if (error) {
//     console.log('Error occurred while sending the email:', error.message);
//   } else {
//     console.log('Email sent successfully!');
//   }
// });

  
  
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));