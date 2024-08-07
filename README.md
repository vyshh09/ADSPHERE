
Open this git folder in VS Code. Make sure you run "git" commands in the right folder only (parent directory, ```code``` directory, ```frontend``` / ```backend``` folder). 

# Instructions for implementing code
- Make sure to follow all these while implementing your part of code.
- Ideally, each person should work on different files. If not, should work on independent parts of code. To minimize the conflicts.
- Discuss if any changes are needed in previous-coded component.
- Write good commit messages, short but should be understandable.

---
### Pull everytime before you begin to change the code.
```
    git pull
```
This will fetch if any additions / deletions are done to the main repository. If any conflicts are noticed by git, VS Code will show the conflicts and you can discuss and choose which code should go there.

---
### Working with modules
We don't push ```node_modules``` folder to the main repository because it consumes a lot of space, and is not efficient. All the modules with the versions which are used will be listed in ```package.json``` file. The following command will directly install all modules in the ```package.json```
```
    npm install
```
(in both frontend and backend). 
This is to be done along with the ```git pull``` if any new modules are added.

---
### Add your implementation
---

### Review the code, make someone else from the team also review the code, then push
(pull before pushing also)
```
    git add .
    git commit -m "changes-you-ve-done"
    git push
```
To ensure you are commiting the right files,
- Keep an eye on "M", "U" beside file names in VS Code (M - modified file, U - newly created file)
- Inside code, Blue and Green lines beside line number (green - newly added line, blue - modified line)

If you want to push only some files which are changed, you can specify that in  ```git add```
```
    git add file_name.jsx
```
---

### Files / folders in the ```.gitignore``` will ge ignored, and won't be pushed
```node_modules``` is one of such.

---
### Development environment
- In frontend, React automatically re-renders if any changes are noticed.
- But in backend, this is not the case. So, we are using a dev dependency called ```nodemon```.
- ```npm start``` - static, won't restart on code changes
- ```npm run dev``` - development mode, restart on every code change.

Summing this, in frontend,
```
    npm start
```

In backend,
```
    npm run dev
```
