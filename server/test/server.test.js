const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Article} = require('./../models/article');

const articles = [{
  _id: new ObjectID(),
  title: 'Occaecat consectetur minim labore ullamco quis reprehenderit excepteur officia.',
  body: 'Sit aute velit exercitation magna voluptate incididunt aliqua aute nostrud id ad ut ex sint labore labore duis. Est labore fugiat magna labore veniam fugiat anim tempor ex eiusmod aliquip amet adipisicing esse enim dolor aute. Sunt dolor pariatur reprehenderit enim dolore aliqua id nostrud id velit sit consectetur.'
}, {
  _id: new ObjectID(),
  title: 'Enim eiusmod veniam amet dolore cupidatat id deserunt amet id in nostrud cupidatat cillum sunt deserunt.',
  body: 'Ut cupidatat dolore ea mollit reprehenderit commodo incididunt nostrud pariatur. Proident qui mollit ad pariatur et dolor veniam tempor est magna do ipsum. Esse est ad do consectetur do exercitation adipisicing excepteur laboris non voluptate commodo magna anim.'
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
