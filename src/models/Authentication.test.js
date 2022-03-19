import firebase from "firebase/app";
import Authentication from "./Authentication";

describe('Authentication', () => {
	const signInWithEmailAndPassword = jest.fn();
	const onAuthStateChanged = jest.fn();
	firebase.auth = jest.fn(() => ({
		signInWithEmailAndPassword,
		onAuthStateChanged
	}));

	afterAll(() => {
		signInWithEmailAndPassword.mockRestore();
		firebase.auth.mockRestore();
	});

	test('.signIn', async () => {
		await Authentication.signIn('a@a.com', 'password')

		expect(signInWithEmailAndPassword).toHaveBeenCalledWith('a@a.com', 'password');
	});

	test('.signInListener', () => {
		Authentication.signInListener(() => {});

		expect(onAuthStateChanged).toHaveBeenCalledWith(expect.any(Function));
	});
});
