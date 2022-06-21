export enum AttemptStatus {
    notAttempted = 'NotAttempted',
    inProgress = 'InProgress',
    finished = 'Finished',
}

export const attemptStatusPath: { [status in AttemptStatus]: string } = {
    [AttemptStatus.notAttempted]: 'begin',
    [AttemptStatus.inProgress]: 'inprogress',
    [AttemptStatus.finished]: 'result',
};
