export enum EntityTypes {
    Student = 'STUDENT',
    Therapist = 'THERAPIST',
    Class = 'CLASS',
}

export const EntityTypeLabels: Record<EntityTypes, string> = {
    [EntityTypes.Student]: 'Uczeń',
    [EntityTypes.Therapist]: 'Terapeuta',
    [EntityTypes.Class]: 'Klasa',
};
