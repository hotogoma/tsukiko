# tsukiko

## Setup
```
npm install
```

### Environment Variables
| Key | Default |
|---|---|
| `SLACK_TOKEN` | (Required) |
| `HTTP_ACCESS_TOKEN` | (Required) |
| `REDIS_URL` | `redis://127.0.0.1:6379` |
| `GOOGLE_CSE_ID` | `undefined` |
| `GOOGLE_CSE_KEY` | `undefined` |
| `AWS_ACCESS_KEY_ID` | `undefined` |
| `AWS_SECRET_ACCESS_KEY` | `undefined` |
| `IRKIT_CLIENT_KEY` | `undefined` |
| `IRKIT_DEVICE_ID` | `undefined` |

## Run
```
npm start
```

## Test
```
npm test
```

## Lint
```
npm run lint
```

### pre-commit hook
``` sh
echo "#\!/bin/bash -eu\n\nnpm run lint" > .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```
