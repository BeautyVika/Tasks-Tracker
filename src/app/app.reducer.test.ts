import { appReducer, AppInitialStateType, setError, setStatus} from 'app/app.reducer'

let startState: AppInitialStateType;

beforeEach(() => {
	startState = {
		error: null,
		status: "idle",
		isInitialized: false
	}
})

test('correct error message should be set', () => {
	const endState = appReducer(startState, setError({error: "some error"}))
	expect(endState.error).toBe('some error');
})

test('correct status should be set', () => {
	const endState = appReducer(startState, setStatus({status: "loading"}))
	expect(endState.status).toBe('loading');
})

