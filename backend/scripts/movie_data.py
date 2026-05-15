"""
NTR Filmography - Complete Movie Metadata
Single source of truth for all movie data (since R2 only has media, not metadata).
Base URLs are managed centrally in config.media_config - do NOT add them here.
"""
from django.utils.text import slugify

# Default poster/banner filenames (will be replaced when user uploads banners later)
DEFAULT_POSTER_FILENAME = 'wp5283563.jpg'
DEFAULT_BANNER_FILENAME = 'wp5283563.jpg'

# Complete Jr. NTR filmography with R2 folder name mapping
# r2_folder: the exact folder name as it appears in R2 bucket Audio/ paths
# Note: Some folders have trailing underscores, different casing, or alternate spellings
MOVIES = [
    {
        'title': 'Ninnu Choodalani',
        'release_year': 2001,
        'description': 'The debut film of Jr. NTR. A romantic drama where a young man falls in love with a woman he meets, navigating the complexities of love and relationships.',
        'genre': 'Romance, Drama',
        'director': 'V. R. Pratap',
        'duration_minutes': 155,
        'box_office': '',
        'r2_folder': 'Ninnu Choodalani',  # Audio, Photos/Movie, VideoCuts/Movie Cuts
    },
    {
        'title': 'Student No. 1',
        'release_year': 2001,
        'description': 'A drama about a student who fights against corruption in the education system. Jr. NTR plays a college student who stands up against injustice.',
        'genre': 'Drama',
        'director': 'S. S. Rajamouli',
        'duration_minutes': 158,
        'box_office': '',
        'r2_folder': 'Student No1',  # Photos/Movie has "Student No1"
    },
    {
        'title': 'Subbu',
        'release_year': 2001,
        'description': 'A romantic comedy where a young man named Subbu navigates love and family expectations.',
        'genre': 'Romance, Comedy',
        'director': 'Rudraraju Suresh Varma',
        'duration_minutes': 150,
        'box_office': '',
        'r2_folder': 'Subbu',  # Photos/Movie, VideoCuts/Movie Cuts
    },
    {
        'title': 'Aadi',
        'release_year': 2002,
        'description': 'A young man fights against a powerful criminal to protect his family and loved ones. Jr. NTR plays a dynamic dual role in this action entertainer.',
        'genre': 'Action, Drama',
        'director': 'V. V. Vinayak',
        'duration_minutes': 165,
        'box_office': '',
        'r2_folder': 'Aadi',  # Audio, Photos/Movie, Movie Cuts has "Aadi_"
    },
    {
        'title': 'Allari Ramudu',
        'release_year': 2002,
        'description': 'A comedic entertainer where a mischievous young man brings joy and chaos to his village.',
        'genre': 'Comedy, Drama',
        'director': 'B. Gopal',
        'duration_minutes': 150,
        'box_office': '',
        'r2_folder': 'Allari Ramudu',  # Audio, Photos/Movie
    },
    {
        'title': 'Naaga',
        'release_year': 2003,
        'description': 'An action drama centered around a village headman who fights against oppression and injustice.',
        'genre': 'Action, Drama',
        'director': 'A. M. Ratnam',
        'duration_minutes': 155,
        'box_office': '',
        'r2_folder': 'Naaga',  # Audio, Photos/Movie
    },
    {
        'title': 'Simhadri',
        'release_year': 2003,
        'description': 'A village headman decides to sacrifice his own life to avenge the injustice meted out to poor villagers. The film that established Jr. NTR as a mass action hero.',
        'genre': 'Action, Drama',
        'director': 'S. S. Rajamouli',
        'duration_minutes': 165,
        'box_office': '',
        'r2_folder': 'Simhadri',  # Photos/Movie, Video Songs
    },
    {
        'title': 'Andhrawala',
        'release_year': 2004,
        'description': 'A high-octane action film about a man seeking revenge for his family massacre.',
        'genre': 'Action',
        'director': 'Puri Jagannadh',
        'duration_minutes': 158,
        'box_office': '',
        'r2_folder': 'Andhrawala',  # Audio, Photos/Movie, Video Songs
    },
    {
        'title': 'Samba',
        'release_year': 2004,
        'description': 'An action comedy about a fisherman who gets entangled in political rivalry and fights for justice.',
        'genre': 'Action, Comedy',
        'director': 'V. V. Vinayak',
        'duration_minutes': 155,
        'box_office': '',
        'r2_folder': 'Samba',  # Photos/Movie
    },
    {
        'title': 'Naa Alludu',
        'release_year': 2005,
        'description': 'A comedy entertainer about a young man who pretends to be someone else to win the heart of his beloved.',
        'genre': 'Comedy, Romance',
        'director': 'B. Gopal',
        'duration_minutes': 150,
        'box_office': '',
        'r2_folder': 'Naa Alludu',  # Audio, Photos/Movie, Video Songs
    },
    {
        'title': 'Narasimhudu',
        'release_year': 2005,
        'description': 'An action film about a powerful man who takes on the corrupt system to protect the innocent.',
        'genre': 'Action',
        'director': 'B. Gopal',
        'duration_minutes': 155,
        'box_office': '',
        'r2_folder': 'Narasimhudu',  # Audio, Photos/Movie, Video Songs
    },
    {
        'title': 'Ashok',
        'release_year': 2006,
        'description': 'An action romantic drama about a software engineer who falls in love and fights against a dangerous criminal.',
        'genre': 'Action, Romance',
        'director': 'Surender Reddy',
        'duration_minutes': 160,
        'box_office': '',
        'r2_folder': 'Ashok',  # Audio, Photos/Movie, Video Songs
    },
    {
        'title': 'Rakhi',
        'release_year': 2006,
        'description': 'A family drama about a brother who goes to great lengths to protect his sister and fulfill their dreams.',
        'genre': 'Drama, Family',
        'director': 'Krishna Vamsi',
        'duration_minutes': 165,
        'box_office': '',
        'r2_folder': 'Rakhi',  # Photos/Movie, Video Songs
    },
    {
        'title': 'Yamadonga',
        'release_year': 2007,
        'description': 'A fantasy action comedy where a thief dies and goes to Yamalokam, challenging the god of death himself. A landmark film in Jr. NTR career.',
        'genre': 'Fantasy, Action, Comedy',
        'director': 'S. S. Rajamouli',
        'duration_minutes': 168,
        'box_office': '',
        'r2_folder': 'YamaDonga',  # Photos/Movie
    },
    {
        'title': 'Kantri',
        'release_year': 2008,
        'description': 'A stylish action film about a gangster with a heart of gold who fights against injustice.',
        'genre': 'Action',
        'director': 'Meher Ramesh',
        'duration_minutes': 155,
        'box_office': '',
        'r2_folder': 'Kantri',  # Audio, Photos/Movie has "kantri"
    },
    {
        'title': 'Adhurs',
        'release_year': 2010,
        'description': 'A comedy action film where Jr. NTR plays a dual role - a priest and a gangster. Full of entertainment and action sequences.',
        'genre': 'Action, Comedy',
        'director': 'V. V. Vinayak',
        'duration_minutes': 162,
        'box_office': '',
        'r2_folder': 'Adhurs',  # Audio, Photos/Movie
    },
    {
        'title': 'Brindavanam',
        'release_year': 2010,
        'description': 'A romantic action drama about a young man who pretends to be a lover to help a family, only to find real love.',
        'genre': 'Romance, Action, Drama',
        'director': 'Vamsi Paidipally',
        'duration_minutes': 170,
        'box_office': '',
        'r2_folder': 'Brindavanam',  # Audio, Photos/Movie has "Brindaavanam", Video Songs
    },
    {
        'title': 'Shakti',
        'release_year': 2011,
        'description': 'An action drama about a powerful family feud and a man caught between love and duty.',
        'genre': 'Action, Drama',
        'director': 'Meher Ramesh',
        'duration_minutes': 158,
        'box_office': '',
        'r2_folder': 'Shakti',  # Photos/Movie, Video Songs
    },
    {
        'title': 'Oosaravelli',
        'release_year': 2011,
        'description': 'An action thriller about a man who uses his unique skills to take revenge on those who wronged his family.',
        'genre': 'Action, Thriller',
        'director': 'Surender Reddy',
        'duration_minutes': 155,
        'box_office': '',
        'r2_folder': 'Oosaravelli',  # Audio, Photos/Movie, Video Songs, Movie Cuts
    },
    {
        'title': 'Dhammu',
        'release_year': 2012,
        'description': 'An action drama about a fierce warrior who fights against a powerful antagonist to protect his people.',
        'genre': 'Action, Drama',
        'director': 'Boyapati Srinu',
        'duration_minutes': 160,
        'box_office': '',
        'r2_folder': 'Dhammu',  # Audio, Photos/Movie (as "Dhammu"), Video Songs
    },
    {
        'title': 'Baadshah',
        'release_year': 2013,
        'description': 'A stylish action comedy about a carefree young man who becomes a powerful don. Known for its mass appeal and entertainment.',
        'genre': 'Action, Comedy',
        'director': 'Srinu Vaitla',
        'duration_minutes': 165,
        'box_office': '',
        'r2_folder': 'Baadshah',  # Audio, Photos/Movie, Video Songs
    },
    {
        'title': 'Ramayya Vasthavayya',
        'release_year': 2013,
        'description': 'A romantic action drama about a young man who falls in love and faces challenges from his past.',
        'genre': 'Action, Romance, Drama',
        'director': 'Harish Shankar',
        'duration_minutes': 160,
        'box_office': '',
        'r2_folder': 'Ramayya Vastavayya',  # Photos/Movie
    },
    {
        'title': 'Rabhasa',
        'release_year': 2014,
        'description': 'An action entertainer about a fearless young man who takes on a powerful gang to protect his family and love.',
        'genre': 'Action, Drama',
        'director': 'Santosh Srinivas',
        'duration_minutes': 155,
        'box_office': '',
        'r2_folder': 'Rabhasa',  # Photos/Movie
    },
    {
        'title': 'Temper',
        'release_year': 2015,
        'description': 'A cop drama about a suspended police officer who fights against corruption and injustice. Known for its intense action and powerful performance.',
        'genre': 'Action, Drama, Thriller',
        'director': 'Puri Jagannadh',
        'duration_minutes': 158,
        'box_office': '',
        'r2_folder': 'Temper',  # Photos/Movie, Video Songs
    },
    {
        'title': 'Nannaku Prematho',
        'release_year': 2016,
        'description': 'A family action drama about a son who fights against a corporate giant to fulfill his fathers dream and save his family.',
        'genre': 'Action, Drama, Family',
        'director': 'Sukumar',
        'duration_minutes': 165,
        'box_office': '',
        'r2_folder': 'Nannaku Prematho',  # Audio, Photos/Movie, Movie Cuts
    },
    {
        'title': 'Janatha Garage',
        'release_year': 2016,
        'description': 'An action drama about a mechanic who runs a garage that serves as a front for helping the oppressed. A major commercial success.',
        'genre': 'Action, Drama',
        'director': 'Koratala Siva',
        'duration_minutes': 162,
        'box_office': '',
        'r2_folder': 'Janatha Garage',  # Audio, Photos/Movie, Movie Cuts, Video Songs
    },
    {
        'title': 'Jai Lava Kusa',
        'release_year': 2017,
        'description': 'Jr. NTR plays a triple role in this action drama about three brothers with contrasting personalities. Showcases extraordinary acting range.',
        'genre': 'Action, Drama',
        'director': 'K. S. Ravindra',
        'duration_minutes': 170,
        'box_office': '',
        'r2_folder': 'Jai Lava Kusa',  # Audio, Photos/Movie, Movie Cuts
    },
    {
        'title': 'Aravinda Sametha',
        'release_year': 2018,
        'description': 'A powerful action drama about caste-based violence in Rayalaseema. Jr. NTR plays a young man who breaks the cycle of vengeance.',
        'genre': 'Action, Drama',
        'director': 'Trivikram Srinivas',
        'duration_minutes': 168,
        'box_office': '',
        'r2_folder': 'Aravinda Sametha',  # Audio (has Aravinda Sametha), Photos/Movie, Video Songs
    },
    {
        'title': 'RRR',
        'release_year': 2022,
        'description': 'An epic period action drama about two Indian revolutionaries in the 1920s fighting against the British Raj. Earned global recognition including an Academy Award.',
        'genre': 'Action, Drama, Period',
        'director': 'S. S. Rajamouli',
        'duration_minutes': 187,
        'box_office': '$150M+',
        'r2_folder': 'RRR',  # Audio (has complex substructure), Photos/Movie, Video Songs
    },
    {
        'title': 'Devara',
        'release_year': 2024,
        'description': 'A high-octane action drama set in a coastal village where a fearless man storms into the world of gangs and gangsters. Part 1 of an epic saga.',
        'genre': 'Action, Drama',
        'director': 'Koratala Siva',
        'duration_minutes': 180,
        'box_office': '$100M+',
        'r2_folder': 'Devara',  # Audio, Photos/Movie, Movie Cuts, Video Songs
    },
]

# Photo folder type mapping from bucket folder names to model types
PHOTO_TYPES = {
    'Movie': 'movie',
    'Event': 'event',
    'Offline': 'offline',
}

# Extra photo movie folders that aren't in the main filmography
# (Sr. NTR films, design edits, upcoming projects, etc.)
EXTRA_PHOTO_MOVIE_FOLDERS = [
    'AI', 'Bala Ramayanam', 'Bhaktha Markandeya', 'Brahmarshi Vishwamitra',
    'Chintakayala Ravi', 'Design Edits', 'NTR-NEEL', 'Title PNG_s', 'War2',
]

# Map movie titles to their Photos/Movie folder names (handles special cases)
MOVIE_PHOTO_FOLDER_MAP = {
    'Brindavanam': 'Brindaavanam',
    'Kantri': 'kantri',
    'Yamadonga': 'YamaDonga',
    'Student No. 1': 'Student No1',
    'Ramayya Vasthavayya': 'Ramayya Vastavayya',
}

# Map movie titles to VideoCuts/Video Songs folder names (trailing underscores)
VIDEO_SONG_FOLDER_MAP = {
    'Janatha Garage': 'Janatha Garage_',
    'Nannaku Prematho': 'Nannaku Prematho_',
}

# Map movie titles to VideoCuts/Movie Cuts folder names (trailing underscores)
MOVIE_CUT_FOLDER_MAP = {
    'Aadi': 'Aadi_',
}


def get_r2_folder_for_movie(movie_title):
    """Get the Audio folder name for a movie (matches bucket Audio/ structure)."""
    special_cases = {
        'Student No. 1': 'Student No1',
        'Yamadonga': 'YamaDonga',
        'Ramayya Vasthavayya': 'Ramayya Vastavayya',
        'Aravinda Sametha': 'Aravinda Sametha',
    }
    return special_cases.get(movie_title, movie_title)


def build_movie_lookup():
    """Build lookup dicts for quick access."""
    by_title = {}
    by_slug = {}
    for m in MOVIES:
        m['slug'] = slugify(m['title'])
        by_title[m['title']] = m
        by_slug[m['slug']] = m
    return by_title, by_slug


MOVIES_BY_TITLE, MOVIES_BY_SLUG = build_movie_lookup()
