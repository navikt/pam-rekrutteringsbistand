import { EventEmitter } from 'events';
import { ApiError, checkTokenExpiration } from '../../../api/api';

export const TOKEN_EXPIRES_SOON = 'TOKEN_EXPIRES_SOON';
export const TOKEN_HAS_EXPIRED = 'TOKEN_HAS_EXPIRED';

export default class TokenExpirationChecker extends EventEmitter {

    timeoutId = undefined;
    isPaused = false;
    intervalInMilliseconds;

    constructor(interval = 60000) {
        super();
        this.intervalInMilliseconds = interval;
    }

    start() {
        this.isPaused = false;
        this.loop();
    }

    pause() {
        this.isPaused = true;
    }

    destroy() {
        this.timeoutId = undefined;
        this.removeAllListeners();
    }

    tokenWillExpireSoon = async () => (await checkTokenExpiration().content);

    timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    dispatchTokenExpired() {
        this.emit(TOKEN_HAS_EXPIRED);
    }

    dispatchTokenExpiresSoon() {
        this.emit(TOKEN_EXPIRES_SOON);
    }

    loop = async () => {
        if (this.isPaused) {
            return;
        }

        if (this.timeoutId) {
            this.timeoutId = undefined;
        }

        await this.timeout(this.intervalInMilliseconds);

        try {
            const tokenExpiresSoon = await this.tokenWillExpireSoon();

            if (tokenExpiresSoon && !this.isPaused) {
                this.dispatchTokenExpiresSoon();
            }
        } catch (e) {
            if (e instanceof ApiError && e.status === 401) {
                this.dispatchTokenExpired();
            } else {
                throw e;
            }
        }

        this.loop();
    };
}
