const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Article} = require('./../models/article');

const articles = [{
  _id: new ObjectID(),
  title: 'Occaecat consectetur minim labore ullamco quis reprehenderit excepteur officia.',
  body: 'Sit aute velit exercitation magna voluptate incididunt aliqua aute nostrud id ad ut ex sint labore labore duis. Est labore fugiat magna labore veniam fugiat anim tempor ex eiusmod aliquip amet adipisicing esse enim dolor aute. Sunt dolor pariatur reprehenderit enim dolore aliqua id nostrud id velit sit consectetur.',
  createdAt: new Date().getTime()
}, {
  _id: new ObjectID(),
  title: 'Enim eiusmod veniam amet dolore cupidatat id deserunt amet id in nostrud cupidatat cillum sunt deserunt.',
  body: 'Ut cupidatat dolore ea mollit reprehenderit commodo incididunt nostrud pariatur. Proident qui mollit ad pariatur et dolor veniam tempor est magna do ipsum. Esse est ad do consectetur do exercitation adipisicing excepteur laboris non voluptate commodo magna anim.',
  createdAt: new Date().getTime()
}];

beforeEach((done) => {
  Article.remove({}).then(() => {
    return Article.insertMany(articles);
  }).then(() => done());
});

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
