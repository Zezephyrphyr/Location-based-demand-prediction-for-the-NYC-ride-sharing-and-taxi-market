import csv
import plac

@plac.annotations(
    output_file=plac.Annotation("Output file"),
    size=plac.Annotation("Grid size", 'option', 's'))
def main(output_file, size = 30):
    GRID_SIZE = size

    BOUNDS = {
        'north': 40.90493915804564,
        'south': 40.48846518521376,
        'east': -73.72326885045277,
        'west': -74.27971341040893
    }

    width = (BOUNDS['east'] - BOUNDS['west']) / GRID_SIZE
    height = (BOUNDS['north'] - BOUNDS['south']) / GRID_SIZE

    with open(output_file, 'w', newline='') as csvfile:
        spamwriter = csv.writer(csvfile, delimiter=',')
        spamwriter.writerow(['x', 'y', 'north', 'south', 'east', 'west'])

        for x in range(0, GRID_SIZE):
            for y in range(0, GRID_SIZE):
                north = BOUNDS['south'] + height * (y + 1)
                south = BOUNDS['south'] + height * y
                east = BOUNDS['west'] + width * (x + 1)
                west = BOUNDS['west'] + width * x

                spamwriter.writerow([x, y, north, south, east, west])

if __name__ == '__main__':
    plac.call(main)
