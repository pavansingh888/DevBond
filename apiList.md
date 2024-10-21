# DevBond APIs

## authRouter
- POST /signup
- POST /login
- POST /logout 

## profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password - forgot password API

## connectionRequestRouter
- POST /request/send/:status/:userId  - status can be intrested or ignored
    - POST /request/send/interested/:userId
    - POST /request/send/ignored/:userId
  
- POST /request/review/:status/:requestId - status can be accepted or rejected
    - POST /request/review/accepted/:requestId
    - POST /request/review/rejected/:requestId

## userRouter
- GET /user/connections
- GET /user/requests/received
- GET /user/feed - Gets you the profiles of other users on platform

Status: ignore, interested, accepeted, rejected