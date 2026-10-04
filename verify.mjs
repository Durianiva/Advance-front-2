import assert from 'node:assert/strict';
import { createServer } from 'vite';
const cache = new Map();
globalThis.localStorage = { getItem: key => cache.get(key) ?? null, setItem: (key, value) => cache.set(key, value) };
const server = await createServer({ server: { middlewareMode: true } });
try {
 const { store } = await server.ssrLoadModule('/src/store/redux/store.js');
 const actions = await server.ssrLoadModule('/src/store/redux/coursesSlice.js');
 assert.equal(store.getState().courses.items.length, 0);
 await store.dispatch(actions.fetchCourses()).unwrap();
 const initial = store.getState().courses.items.length;
 assert.ok(initial > 0);
 const template = store.getState().courses.items[0];
 const added = await store.dispatch(actions.addCourse({ ...template, title: 'CRUD test' })).unwrap();
 assert.equal(store.getState().courses.items.length, initial + 1);
 await store.dispatch(actions.editCourse({ id: added.id, data: { title: 'Edited test' } })).unwrap();
 assert.equal(store.getState().courses.items.find(x => x.id === added.id).title, 'Edited test');
 await store.dispatch(actions.fetchCourses()).unwrap();
 assert.equal(store.getState().courses.items.find(x => x.id === added.id).title, 'Edited test');
 await store.dispatch(actions.deleteCourse(added.id)).unwrap();
 assert.equal(store.getState().courses.items.length, initial);
 await assert.rejects(store.dispatch(actions.editCourse({ id: -1, data: {} })).unwrap());
 assert.equal(store.getState().courses.items.length, initial);
 console.log('PASS: empty initial state, GET, ADD, EDIT, persisted GET, DELETE, missing-record rejection');
} finally { await server.close(); }
