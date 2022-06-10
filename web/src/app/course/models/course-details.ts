import { CourseInfo } from './course-info';

export interface CourseDetails extends CourseInfo {
    isAttended: boolean;
    isOwner: boolean;
}
