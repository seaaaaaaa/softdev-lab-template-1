package service

import (
	"testing"

	"github.com/stretchr/testify/require"
)

type stubHealthService struct{}

func (s stubHealthService) Healthz() string {
	return "ok"
}

type stubFooBarService struct{}

func (s stubFooBarService) FooBar() string {
	return "foo bar"
}

type stubGreetService struct{}

func (s stubGreetService) Greet(name string) string {
	return "greeted " + name
}

func TestDefaultServiceHealthz(t *testing.T) {
	t.Parallel()

	appService := NewDefaultService(stubHealthService{}, stubFooBarService{}, stubGreetService{})

	if got := appService.Healthz(); got != "ok" {
		t.Fatalf("Healthz() = %q, want %q", got, "ok")
	}
}

func TestDefaultServiceFooBar(t *testing.T) {
	t.Parallel()

	appService := NewDefaultService(stubHealthService{}, stubFooBarService{}, stubGreetService{})

	if got := appService.FooBar(); got != "ok -> foo bar" {
		t.Fatalf("FooBar() = %q, want %q", got, "ok -> foo bar")
	}
}

func TestDefaultServiceGreet(t *testing.T) {
	t.Parallel()

	appService := NewDefaultService(stubHealthService{}, stubFooBarService{}, stubGreetService{})

	if got := appService.Greet("Ann"); got != "greeted Ann" {
		t.Fatalf("Greet() = %q, want %q", got, "greeted Ann")
	}
}

func TestNewDefaultHealthService(t *testing.T) {
	t.Parallel()

	healthService := NewDefaultHealthService()
	require.NotNil(t, healthService)
	require.Equal(t, "ok", healthService.Healthz())
}

func TestNewDefaultFooBarService(t *testing.T) {
	t.Parallel()

	fooBarService := NewDefaultFooBarService()
	require.NotNil(t, fooBarService)
	require.Equal(t, "foo bar", fooBarService.FooBar())
}

func TestNewDefaultGreetService(t *testing.T) {
	t.Parallel()

	greetService := NewDefaultGreetService()
	require.NotNil(t, greetService)
	require.Equal(t, "Hello, Ann!", greetService.Greet("Ann"))
	require.Equal(t, "Hello, friend!", greetService.Greet(""))
}

func TestMockServiceMethods(t *testing.T) {
	t.Parallel()

	mockService := &MockService{}
	mockService.On("Healthz").Return("ok")
	mockService.On("FooBar").Return("foo bar")
	mockService.On("Greet", "Ann").Return("Hello, Ann!")

	require.Equal(t, "ok", mockService.Healthz())
	require.Equal(t, "foo bar", mockService.FooBar())
	require.Equal(t, "Hello, Ann!", mockService.Greet("Ann"))
	mockService.AssertExpectations(t)
}
