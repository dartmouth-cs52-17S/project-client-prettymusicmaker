# lab4-dylansc
What I did:
I used react, redux and a supplied CRUD API to build a blogging platform. As in the collaborative notes app, React allowed for real time creation and deletion of objects without requiring a page to be resubmit. To manage state, I used redux which allowed for simple access to individual posts throughout the app. The posts were stored in the 'store', which I affected with 'actions' that trigger 'reducers'. I also used 'thunks' to create action functions for use during dispatch. I also used axios to make http style API calls.

What worked:
React worked very well and allowed dynamic creation of objects. Redux worked for the most part despite some issues figuring out how to initialize everything.

What Didn't:
It took a long time to understand thunks and how they interact with redux actions and reducers.
