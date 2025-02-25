for a in range(200 , 0, -1):
    fl = True
    for x in range(100):
        for y in range(100):
            if not (((2*x + 3*y) < 30) or (x + y >= a)):
                fl = False

    if fl == True:
        print(a)
        break