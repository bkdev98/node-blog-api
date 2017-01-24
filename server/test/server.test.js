const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Article} = require('./../models/article');
const {User} = require('./../models/user');
const {articles, populateArticles, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateArticles);

describe('POST /articles', () => {
  it('should create a new article', (done) => {
    var title = 'Test article title';
    var body = 'Test article body';

    request(app)
      .post('/articles')
      .send({title, body})
      .expect(200)
      .expect((res) => {
        expect(res.body.title).toBe(title);
        expect(res.body.body).toBe(body);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Article.find().then((articles) => {
          expect(articles.length).toBe(3);
          expect(articles[2].title).toBe(title);
          expect(articles[2].body).toBe(body);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create article with invalid body data', (done) => {
    request(app)
      .post('/articles')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Article.find().then((articles) => {
          expect(articles.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET /articles', () => {
  it('should get all articles', (done) => {
    request(app)
      .get('/articles')
      .expect(200)
      .expect((res) => {
        expect(res.body.articles.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /articles/:id', () => {
  it('should return article doc', (done) => {
    request(app)
      .get(`/articles/${articles[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.article.title).toBe(articles[0].title);
      })
      .end(done);
  });

  it('should return 404 if article not found', (done) => {
    var someID = new ObjectID().toHexString();

    request(app)
      .get(`/articles/${someID}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 if non-object ids', (done) => {
    request(app)
      .get('/articles/123')
      .expect(404)
      .end(done);
  });
})

describe('DELETE /articles/:id', () => {
  it('should delete article', (done) => {
    request(app)
      .delete(`/articles/${articles[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.article.title).toBe(articles[0].title);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Article.find().then((articles) => {
          expect(articles.length).toBe(1);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return 404 if article not found', (done) => {
    var hexId = new ObjectID().toHexString();

    request(app)
      .delete(`/articles/${hexId}`)
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Article.find().then((articles) => {
          expect(articles.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return 404 if object id is invalid', (done) => {
    request(app)
      .delete('/articles/123')
      .expect(404)
      .end(done);
  });
});

describe('PATCH /articles/:id', () => {
  it('should update article', (done) => {
    var id = articles[0]._id.toHexString();
    var body = {
      'title': 'Officia velit sint deserunt consequat ea ad velit dolore voluptate.',
      'body': 'Irure cillum cupidatat occaecat quis in do et consequat occaecat. Dolor aute consequat eiusmod consequat qui veniam consectetur. Veniam proident ex labore aliqua nulla sint mollit cupidatat.'
    }
    request(app)
      .patch(`/articles/${id}`)
      .send(body)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Article.find().then((articles) => {
          expect(articles[0].title).toBe(body.title);
          expect(articles[0].body).toBe(body.body);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return 404 if article not found', (done) => {
    var hexId = new ObjectID().toHexString();
    var body = {
      'title': 'Officia velit sint deserunt consequat ea ad velit dolore voluptate.',
      'body': 'Irure cillum cupidatat occaecat quis in do et consequat occaecat. Dolor aute consequat eiusmod consequat qui veniam consectetur. Veniam proident ex labore aliqua nulla sint mollit cupidatat.'
    }

    request(app)
      .patch(`/articles/${hexId}`)
      .send(body)
      .expect(404)
      .end(done);
  });

  // it('should not update article with invalid body', (done) => {
  //   var id = articles[0]._id;
  //   var body = {
  //     'title': '',
  //     'body': 'Irure cillum cupidatat occaecat quis in do et consequat occaecat. Dolor aute consequat eiusmod consequat qui veniam consectetur. Veniam proident ex labore aliqua nulla sint mollit cupidatat.'
  //   }
  //
  //   request(app)
  //     .patch(`/articles/${id}`)
  //     .send(body)
  //     .expect(400)
  //     .end(done);
  // });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', (done) =>{
    var email = 'bkdev98@gmail.com';
    var password = 'sunghokage';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }

        User.findOne({email}).then((user) => {
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        });
      });
  });

  it('should return validation errors if request invalid', (done) => {
    request(app)
      .post('/users')
      .send({
        email: '&',
        password: 'sung'
      })
      .expect(400)
      .end(done);
  });

  it('should not create user if email in use', (done) => {
    request(app)
      .post('/users')
      .send({
        email: users[0].email,
        password: 'sunghokage'
      })
      .expect(400)
      .end(done);
  });
})
