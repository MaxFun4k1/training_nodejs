// const http = require('http')
// const fs = require('fs')

// const delay = (ms) => {
// 	return new Promise((resolve, reject) => {
// 		setTimeout(() => {
// 			resolve()
// 		}, ms)
// 	})
// }
// const readFile = (path) => {
// 	return new Promise((resolve, reject) => {
// 		fs.readFile(path, (err, data) => {
// 			if (err) reject(err)
// 			else resolve(data)
// 		})
// 	})
// }

// const server = http.createServer(async (request, response) => {
// 	switch(request.url) {
// 		case '/home':
// 			try {
// 				const data = await readFile('pages/about.html')
// 				response.write(data)
// 				response.end()
// 			} catch(err) {
// 				response.write('something wong, 500')
// 				response.end()
// 			}
// 			break;
// 		case '/about':
// 			await delay(3000)
// 			setTimeout(() => {
// 				response.write('ABOUT COURSE')
// 				response.end()
// 			})
// 			break;
// 		default: 
// 			response.write('404 not found')
// 			response.end()
// 	}
// })

// server.listen(3003)

import express from 'express'

const app = express()
const port = 3000

const HTTP_STATUSES = {
	OK_200: 200,
	CREATED_201: 201,
	NO_KONTENT_204: 204,

	BAD_REQUEST_400: 400,
	NOT_FOUND_404: 404
}

const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

const db = {
	courses: [
		{id: 1, title: 'front-end'},
		{id: 2, title: 'back-end'},
		{id: 3, title: 'automation qa'},
		{id: 4, title: 'devops'}
	]
}

app.get('/', (req, res) => {
	res.send({message: 'IT-INCUBATOR.RU'})
})

app.get('/courses', (req, res) => {
	let foundCourses = db.courses;
	
	if(req.query.title) {
		foundCourses = foundCourses.filter(c => c.title.indexOf(req.query.title as string) > -1)
	}

	res.json(foundCourses)
})

app.get('/courses/:id', (req, res) => {
   const foundCourse = db.courses.find(c => c.id === +req.params.id);

	if(!foundCourse) {
		res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
		return;
	}

	res.json(foundCourse)
});

app.post('/courses', (req, res) => {

	if(!req.body.title) {
		res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
		return;
	}

	const createdCourse = {
		id: +(new Date()),
		title: req.body.title
	}

	db.courses.push(createdCourse)
	res.status(HTTP_STATUSES.CREATED_201).json(createdCourse)
})

app.delete('/courses/:id', (req, res) => {
	db.courses = db.courses.filter(c => c.id !== +req.params.id);
 
	 res.sendStatus(HTTP_STATUSES.NO_KONTENT_204)
});

app.put('/courses/:id', (req, res) => {
	if (!req.body.title) {
		res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
		return;
	}

	const foundCourse = db.courses.find(c => c.id === +req.params.id);
 
	 if(!foundCourse) {
		 res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
		 return;
	 }

	 foundCourse.title = req.body.title;
 
	 res.sendStatus(HTTP_STATUSES.NO_KONTENT_204)
 });

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})
