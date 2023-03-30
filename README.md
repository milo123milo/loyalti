# loyalti

Root user is created on init, it cant be created od edited from UI or API. username: root, password: root

Install modules: npm install

Start:
npm run devstart 

View:
localhost:3000

*TODO: hash passwords*

## How to use user roles(admin, user, ...)

Admin protected routes are at folder: './routes/'

User routes are unprotected and anyone who is logged can acces them.

### How to add role protected routes?

**role.admin** check if user is admin

**auth.done** check if there is logged user



Template for adding new admin route at './routes/admin.js':

```js
router.get('/someroute', role.admin, auth.done, function(req, res, next) {
  return res.render('somefile');
});
```

Template for adding new user route at './routes/user.js: 

```js
router.get('/someroute', auth.done, function(req, res, next) {
  res.render('somefile');
});
```

### How to add role depended element rendering

Pass user role to render in your routes file. For example '.routes/index.js'

```js
router.get('/', auth.done, function(req, res, next) {
 return res.render('index', { role: req.user.role });
  
});
```

Then at your view folder add the folowing. For example './views/index.ejs'

```html
<div>
   <% if(role === 'admin'){ %>
       <div> This will be rendered </div>
   <% } %>
</div>
```

### How to add new roles?

At folder '.routes/rules/roleCheck.js' add function to check role parameter.

```js
function newrole(req, res, next) {
  if (req.user.role === 'newrole' ) {
     return next()
  }
  return res.redirect('/')
}
//Do not forget to export it back
module.exports = {admin, newrole}
```

Then when you are creating routes you can acces **role.newrole** and pass it to request function to check if role is satisfied.

```javascript
router.get('/someroute', role.newrole, auth.done, function(req, res, next) {
  return res.render('admin');
});
```

Also it is suggested to create new role routes files ar the routes folder. 
