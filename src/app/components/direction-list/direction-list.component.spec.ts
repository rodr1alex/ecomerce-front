/// <reference types="jasmine" />

import { of } from 'rxjs';
import { DirectionListComponent } from './direction-list.component';
import { Direction } from '../../models/general.model';

describe('DirectionListComponent', () => {
  let component: DirectionListComponent;
  let routeMock: { snapshot: { paramMap: { get: jasmine.Spy } } };
  let routerMock: { navigate: jasmine.Spy };
  let directionServiceMock: {
    getByUserId: jasmine.Spy;
    create: jasmine.Spy;
    update: jasmine.Spy;
    remove: jasmine.Spy;
  };
  let alertServiceMock: { success: jasmine.Spy; error: jasmine.Spy };

  beforeEach(() => {
    routeMock = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('55')
        }
      }
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    directionServiceMock = {
      getByUserId: jasmine.createSpy('getByUserId').and.returnValue(of([])),
      create: jasmine.createSpy('create').and.returnValue(of({})),
      update: jasmine.createSpy('update').and.returnValue(of({})),
      remove: jasmine.createSpy('remove').and.returnValue(of({}))
    };

    alertServiceMock = {
      success: jasmine.createSpy('success').and.resolveTo(),
      error: jasmine.createSpy('error').and.resolveTo()
    };

    component = new DirectionListComponent(
      routeMock as any,
      routerMock as any,
      directionServiceMock as any,
      alertServiceMock as any
    );
  });

  it('should read user id from route and load directions on init', async () => {
    const direction = new Direction();
    direction.directionId = 1;
    directionServiceMock.getByUserId.and.returnValue(of([direction]));

    await component.ngOnInit();

    expect(component.userId).toBe(55);
    expect(directionServiceMock.getByUserId).toHaveBeenCalledWith(55);
    expect(component.directionList.length).toBe(1);
  });

  it('should create direction and reload list', async () => {
    const direction = new Direction();
    component.userId = 55;
    spyOn(component, 'getDirectionListByUser').and.resolveTo();

    await component.onCreateDirection(direction);

    expect(directionServiceMock.create).toHaveBeenCalledWith(direction, 55);
    expect(alertServiceMock.success).toHaveBeenCalledWith('Exito', 'Direccion creada con exito');
    expect(component.getDirectionListByUser).toHaveBeenCalledWith(55);
  });

  it('should update direction and reload list', async () => {
    const direction = new Direction();
    component.userId = 55;
    spyOn(component, 'getDirectionListByUser').and.resolveTo();

    await component.onUpdateDirection(direction);

    expect(directionServiceMock.update).toHaveBeenCalledWith(direction);
    expect(alertServiceMock.success).toHaveBeenCalledWith('Exito', 'Direccion actualizada con exito');
    expect(component.getDirectionListByUser).toHaveBeenCalledWith(55);
  });

  it('should remove direction and reload list', async () => {
    component.userId = 55;
    spyOn(component, 'getDirectionListByUser').and.resolveTo();

    await component.onDeleteDirection(3);

    expect(directionServiceMock.remove).toHaveBeenCalledWith(3);
    expect(alertServiceMock.success).toHaveBeenCalledWith('Exito', 'Direccion eliminada con exito');
    expect(component.getDirectionListByUser).toHaveBeenCalledWith(55);
  });

  it('should navigate back to update user route', () => {
    component.userId = 55;

    component.onBack();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/update_user', 55]);
  });
});
