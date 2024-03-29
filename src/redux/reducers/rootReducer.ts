import { combineReducers } from "redux";
import { authReducer } from './authReducer'
import { listsReducer } from './listsReducer'
import { sitesReducer } from './sitesReducer'
import { searchReducer } from './searchReducer'
import { dataReducer } from './dataReducer'
import { discoverReducer } from './discoverReducer'

export const rootReducer = combineReducers({
  auth: authReducer,
  lists: listsReducer,
  sites: sitesReducer,
  search: searchReducer,
  data: dataReducer,
  discover: discoverReducer,
})

export type RootState = ReturnType<typeof rootReducer>