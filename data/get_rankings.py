from pybaseball import pitching_stats
from pybaseball import batting_stats
from pybaseball import pitching_stats_range
from pybaseball import batting_stats_range
from datetime import datetime, timedelta, date
import json

currentDate = datetime.now()
currentMonth = f"{currentDate.month:02d}"
if int(currentMonth) > 3:
    currentYear = currentDate.year
    currentDay = date.today()
    recentDay = currentDay - timedelta(days=14)
    currentDay = str(currentDay)
    recentDay = str(recentDay)
else:
    currentYear = currentDate.year -1
    currentDay = None
    recentDay = None

pitchingData = pitching_stats(currentYear)
battingData = batting_stats(currentYear)

if currentDay is not None:
    recentPitchingData = pitching_stats_range(recentDay, currentDay)
    recentBattingData = batting_stats_range(recentDay, currentDay)

    recentPitchingDataFile = open("../public/json/pitcherRankingsRecent.json", "w")
    recentPitchingDataFile.write(json.dumps(json.loads(recentPitchingData.reset_index().to_json(orient='index')), indent=2))
    recentPitchingDataFile.close()

    recentBattingDataFile = open("../public/json/batterRankingsRecent.json", "w")
    recentBattingDataFile.write(json.dumps(json.loads(recentBattingData.reset_index().to_json(orient='index')), indent=2))
    recentBattingDataFile.close()
else:
    recentPitchingDataFile = open("../public/json/pitcherRankingsRecent.json", "w")
    recentPitchingDataFile.write('{}')
    recentPitchingDataFile.close()

    recentBattingDataFile = open("../public/json/batterRankingsRecent.json", "w")
    recentBattingDataFile.write('{}')
    recentBattingDataFile.close()