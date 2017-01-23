const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Article} = require('./../models/article');

beforeEach((done) => {
  Article.remove({}).then(() => done());
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
          expect(articles.length).toBe(1);
          expect(articles[0].title).toBe(title);
          expect(articles[0].body).toBe(body);
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
          expect(articles.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });
  });

});
