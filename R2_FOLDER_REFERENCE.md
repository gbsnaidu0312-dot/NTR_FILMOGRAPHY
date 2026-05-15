# R2 Folder Structure Reference

> Create this exact folder tree in your Cloudflare R2 bucket: **ntrfilmography**
> After creating, upload media into the respective folders.
> **Base URL**: `https://pub-4b8805119f7f49ae848fa1aaa57dd6d0.r2.dev`

---

## Movies (Posters + Banners)

```
Movies/
  Ninnu-Choodalani/   Student-No-1/        Subbu/
  Aadi/                Allari-Ramudu/       Naaga/
  Simhadri/            Andhrawala/          Samba/
  Naa-Alludu/          Narasimhudu/         Ashok/
  Rakhi/               Yamadonga/           Kantri/
  Adhurs/              Brindavanam/         Shakti/
  Oosaravelli/         Dammu/               Baadshah/
  Ramayya-Vasthavayya/ Rabhasa/             Temper/
  Nannaku-Prematho/    Janatha-Garage/      Jai-Lava-Kusa/
  Aravinda-Sametha/    RRR/                 Devara/
```

## Photos

```
Photos/
  Movies/
    Ninnu-Choodalani/   Student-No-1/        Subbu/
    Aadi/                Allari-Ramudu/       Naaga/
    Simhadri/            Andhrawala/          Samba/
    Naa-Alludu/          Narasimhudu/         Ashok/
    Rakhi/               Yamadonga/           Kantri/
    Adhurs/              Brindavanam/         Shakti/
    Oosaravelli/         Dammu/               Baadshah/
    Ramayya-Vasthavayya/ Rabhasa/             Temper/
    Nannaku-Prematho/    Janatha-Garage/      Jai-Lava-Kusa/
    Aravinda-Sametha/    RRR/                 Devara/

  Events/
    Audio-Launch/        Press-Conference/    Movie-Premiere/
    Award-Shows/         Fan-Meets/

  Offline/
    Candid-Moments/      Family/              Throwback/
    Personal/            Photoshoot/
```

## VideoCuts

```
VideoCuts/
  VideoSongs/
    Ninnu-Choodalani/   Student-No-1/        Subbu/
    Aadi/                Allari-Ramudu/       Naaga/
    Simhadri/            Andhrawala/          Samba/
    Naa-Alludu/          Narasimhudu/         Ashok/
    Rakhi/               Yamadonga/           Kantri/
    Adhurs/              Brindavanam/         Shakti/
    Oosaravelli/         Dammu/               Baadshah/
    Ramayya-Vasthavayya/ Rabhasa/             Temper/
    Nannaku-Prematho/    Janatha-Garage/      Jai-Lava-Kusa/
    Aravinda-Sametha/    RRR/                 Devara/

  MovieCuts/
    Ninnu-Choodalani/   Student-No-1/        Subbu/
    Aadi/                Allari-Ramudu/       Naaga/
    Simhadri/            Andhrawala/          Samba/
    Naa-Alludu/          Narasimhudu/         Ashok/
    Rakhi/               Yamadonga/           Kantri/
    Adhurs/              Brindavanam/         Shakti/
    Oosaravelli/         Dammu/               Baadshah/
    Ramayya-Vasthavayya/ Rabhasa/             Temper/
    Nannaku-Prematho/    Janatha-Garage/      Jai-Lava-Kusa/
    Aravinda-Sametha/    RRR/                 Devara/
```

## Videos

```
Videos/
  EventsAndAds/
    Ad-Films/            Brand-Endorsements/  Press-Meets/
    Audio-Launches/      Movie-Promotions/    Award-Shows/
    Interviews/          Fan-Meets/

  Celebrations/
    Birthday-Celebrations/ Festival-Wishes/   Anniversary-Specials/
    Success-Celebrations/  Special-Messages/  Throwback-Moments/
```

## Audio

```
Audio/
  RRR/                   Devara/              Temper/
  Yamadonga/             Simhadri/            Aadi/
  Brindavanam/           Baadshah/            Janatha-Garage/
```

---

## Quick File Naming

| Asset | File Name |
|-------|-----------|
| Poster | `poster.jpg` |
| Banner | `banner.jpg` |
| Photo | `photo-01.jpg` (increment number) |
| Video Song | `song-01-title.mp4` |
| Movie Cut | `cut-01-name.mp4` |
| Event Video | `video-01.mp4` |
| Audio Track | `track-01-name.mp3` |

> **Result URL example**: 
> `https://pub-4b8805119f7f49ae848fa1aaa57dd6d0.r2.dev/Movies/RRR/poster.jpg`
