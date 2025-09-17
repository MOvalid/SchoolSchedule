export enum EntityType {
    Student = 'STUDENT',
    Therapist = 'THERAPIST',
    Class = 'CLASS',
}

export const EntityTypeLabels: Record<EntityType, string> = {
    [EntityType.Student]: 'Uczeń',
    [EntityType.Therapist]: 'Terapeuta',
    [EntityType.Class]: 'Klasa',
};
