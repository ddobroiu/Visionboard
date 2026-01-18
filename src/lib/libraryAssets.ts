export type LibraryCategory = 'masini' | 'familie' | 'bani' | 'travel' | 'citate';

export interface LibraryItem {
    id: string;
    url: string;
    category: LibraryCategory;
    tags?: string[];
}

export const LIBRARY_ASSETS: LibraryItem[] = [
    // Masini
    { id: 'car-1', category: 'masini', url: 'https://images.unsplash.com/photo-1503376763036-066120622c74?w=400&q=80' },
    { id: 'car-2', category: 'masini', url: 'https://images.unsplash.com/photo-1583121274602-3e2820c698d9?w=400&q=80' },
    { id: 'car-3', category: 'masini', url: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=400&q=80' },
    { id: 'car-4', category: 'masini', url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&q=80' },

    // Familie
    { id: 'fam-1', category: 'familie', url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&q=80' },
    { id: 'fam-2', category: 'familie', url: 'https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?w=400&q=80' },
    { id: 'fam-3', category: 'familie', url: 'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=400&q=80' },

    // Bani / Succes
    { id: 'money-1', category: 'bani', url: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&q=80' },
    { id: 'money-2', category: 'bani', url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&q=80' },
    { id: 'money-3', category: 'bani', url: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&q=80' },

    // Travel
    { id: 'travel-1', category: 'travel', url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=80' },
    { id: 'travel-2', category: 'travel', url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&q=80' },
    { id: 'travel-3', category: 'travel', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80' },

    // Citate
    { id: 'quote-1', category: 'citate', url: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=400&q=80' },
    { id: 'quote-2', category: 'citate', url: 'https://images.unsplash.com/photo-1525016035031-6b0fe489e240?w=400&q=80' },
];
